import { IOAuthApp, IOAuthAppParams } from '../../definition/accessors/IOAuthApp';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class OAuthAppsBridge extends BaseBridge {
    public async doCreate(OAuthApp: IOAuthAppParams, appId: string) {
        if (this.hasWritePermission(appId)) {
            return this.create(OAuthApp, appId);
        }
    }

    public async doGetByid(id: string, appId: string) {
        if (this.hasReadPermission(appId)) {
            return this.getById(id, appId);
        }
    }

    public async doGetByName(name: string, appId: string) {
        if (this.hasReadPermission(appId)) {
            return this.getByName(name, appId);
        }
    }

    public async doUpdate(OAuthApp: IOAuthAppParams, id: string, appId: string) {
        if (this.hasWritePermission(appId)) {
            return this.update(OAuthApp, id, appId);
        }
    }

    public async doDelete(id: string, appId: string) {
        if (this.hasWritePermission(appId)) {
            return this.delete(id, appId);
        }
    }

    public async doPurge(appId: string) {
        if (this.hasWritePermission(appId)) {
            return this.purge(appId);
        }
    }

    protected abstract create(OAuthApp: IOAuthAppParams, appId: string): Promise<string | null>;
    protected abstract getById(id: string, appId: string): Promise<IOAuthApp | null>;
    protected abstract getByName(name: string, appId: string): Promise<Array<IOAuthApp | null>>;
    protected abstract update(OAuthApp: IOAuthAppParams, id: string, appId: string): Promise<void>;
    protected abstract delete(id: string, appId: string): Promise<void>;
    protected abstract purge(appId: string): Promise<void>;

    private hasWritePermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions['oauth-app'].write)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions['oauth-app'].write],
        }));

        return false;
    }

    private hasReadPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions['oauth-app'].read)) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions['oauth-app'].read],
        }));

        return false;
    }
}
